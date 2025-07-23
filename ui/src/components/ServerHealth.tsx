import { useEffect, useState } from 'react';
import { interval, switchMap, catchError, of } from 'rxjs';

interface ServerHealthProps {}

interface HeartbeatResponse {
  status: string;
  timestamp: string;
  activeUsers: number;
}

const ServerHealth: React.FC<ServerHealthProps> = () => {
  const [isServerUp, setIsServerUp] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    // Create an observable that pings the server every second
    const healthCheck$ = interval(1000).pipe(
      switchMap(() =>
        fetch('/api/heartbeat')
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`HTTP ${response.status}`);
          })
          .then((data: HeartbeatResponse) => ({ 
            status: 'up', 
            timestamp: data.timestamp,
            activeUsers: data.activeUsers
          }))
          .catch((error) => ({ 
            status: 'down', 
            error: error.message, 
            timestamp: new Date().toISOString(),
            activeUsers: 0
          }))
      ),
      catchError((error) => {
        console.error('Health check error:', error);
        return of({ 
          status: 'down', 
          error: error.message, 
          timestamp: new Date().toISOString(),
          activeUsers: 0
        });
      })
    );

    // Subscribe to the health check observable
    const subscription = healthCheck$.subscribe({
      next: (result) => {
        setIsServerUp(result.status === 'up');
        setLastChecked(result.timestamp);
        setActiveUsers(result.activeUsers || 0);
      },
      error: (error) => {
        console.error('Subscription error:', error);
        setIsServerUp(false);
        setLastChecked(new Date().toISOString());
        setActiveUsers(0);
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getStatusColor = () => {
    if (isServerUp === null) return 'bg-gray-400';
    return isServerUp ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    if (isServerUp === null) return 'Checking...';
    return isServerUp ? 'Server Online' : 'Server Offline';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col space-y-1 bg-white rounded-lg shadow-lg border px-3 py-2 min-w-[200px]">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor()} ${
              isServerUp ? 'animate-pulse' : ''
            }`}
          ></div>
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
        </div>
        
        {isServerUp && (
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Active Users: {activeUsers}</span>
            {lastChecked && (
              <span className="text-gray-400">
                {new Date(lastChecked).toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
        
        {!isServerUp && lastChecked && (
          <div className="text-xs text-gray-400 text-right">
            {new Date(lastChecked).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerHealth;
