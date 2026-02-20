import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



function App() {

  const hasCentered = useRef(false); // Ainda nao centralizou o mapa

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef({}); // Guarda os objetos dos marcadores do Leaflet

  // ESTADOS DO REACT (Para atualizar a interface)
  const [users, setUsers] = useState({}); // Lista de todos os usuários para a sidebar
  const [status, setStatus] = useState("Aguardando GPS...");
  const [socketId, setSocketId] = useState(null); // ID do socket

  useEffect(() => {
    // Correção do ícone quebrado
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
    
    // 1. Conectar ao servidor Node
    const socket = io('https://map-app-server-1avg.onrender.com');

    socket.on('connect', () => {
      setSocketId(socket.id);
    });

    // 2. INICIALIZA O MAPA
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
    }

    // 3. ATIVA O GPS
    const watchId = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setStatus(`Minha posição: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

      // SÓ CENTRALIZA SE FOR A PRIMEIRA VEZ
      if (!hasCentered.current) {
        mapInstance.current.setView([latitude, longitude], 13);
        hasCentered.current = true; // Marca como "já centralizado"
      }

      // Continua enviando a posição para o servidor normalmente
      socket.emit('update-location', { lat: latitude, lng: longitude });
    }, (err) => setStatus("Erro no GPS: " + err.message), { enableHighAccuracy: true });

    // 4. Ouve o servidor quando alguém se mexer (ou você mesmo)
    socket.on('all-locations', (dataFromServer) => {
      // Atualiza o estado do React (Isso faz a lista lateral atualizar)
      setUsers(dataFromServer);

      // Atualiza os marcadores no Mapa (Lógica do Leaflet)
      Object.keys(dataFromServer).forEach(id => {
        const { lat, lng } = dataFromServer[id];

        if (markers.current[id]) {
          // Se o marcador já existe, só move ele
          markers.current[id].setLatLng([lat, lng]);
        } else {
          // Se é novo, cria o marcador
          markers.current[id] = L.marker([lat, lng]).addTo(mapInstance.current)
            .bindPopup(id === socketId ? "Você" : `Usuário: ${id.substring(0, 5)}`);
        }
      });

      // Remove marcadores de quem se desconectou
      Object.keys(markers.current).forEach(id => {
        if (!dataFromServer[id]) {
          markers.current[id].remove();
          delete markers.current[id];
        }
      });
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off('all-locations');
      socket.disconnect();
    };
  }, []);

  // 5. INTERFACE (JSX)
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>

      {/* Barra de Status Superior
      <div style={{ padding: '10px', background: '#333', color: 'white', textAlign: 'center' }}>
        <strong>{status}</strong>
      </div> */}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LADO ESQUERDO: MAPA */}
        <div ref={mapRef} style={{ flex: 3, background: '#ddd' }} />

        {/* LADO DIREITO: LISTA DE COORDENADAS */}
        <div style={{ flex: 1, background: '#f7f7f7ff', padding: '15px', overflowY: 'auto', borderLeft: '2px solid #090101ff' }}>
          <h3 style={{ marginTop: 0, color: '#121212ff' }}>📍 Usuários Online</h3>

          {Object.keys(users).map((id) => (
            <div key={id} style={{
              marginBottom: '10px',
              padding: '10px',
              background: 'white',
              borderRadius: '8px',
              border: id === socketId ? '2px solid #007bff' : '1px solid #090101ff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              color: '#222121ff'
            }}>
              <strong style={{ color: id === socketId ? '#007bff' : '#333' }}>
                {id === socketId ? "Você" : `Usuário ${id.substring(0, 5)}`}
              </strong>
              <div style={{ fontSize: '14px', marginTop: '5px' }}>
                <div><strong>Lat:</strong> {users[id].lat.toFixed(6)}</div>
                <div><strong>Lng:</strong> {users[id].lng.toFixed(6)}</div>
              </div>
            </div>
          ))}

          {Object.keys(users).length === 0 && <p style={{ color: '#191818ff' }}>Ninguém conectado...</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
