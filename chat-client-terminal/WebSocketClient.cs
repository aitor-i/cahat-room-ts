using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

public class WebSocketClient
{
    private const string ServerUri = "ws://localhost:5004/";

    public async Task Connect()
    {
        ClientWebSocket webSocket = new ClientWebSocket();
        await webSocket.ConnectAsync(new Uri(ServerUri), CancellationToken.None);
        Console.WriteLine("Connected to WebSocket server.");

        // Start receiving and sending messages
        Task receivingTask = StartReceiving(webSocket);
        Task sendingTask = StartSending(webSocket);

        // Wait for both tasks to complete
        await Task.WhenAll(receivingTask, sendingTask);

        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
    }

    private async Task StartReceiving(ClientWebSocket webSocket)
    {
        byte[] buffer = new byte[1024];

        while (webSocket.State == WebSocketState.Open)
        {
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.MessageType == WebSocketMessageType.Text)
            {
                string receivedMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine("Received: " + receivedMessage);
            }
        }
    }

    private async Task StartSending(ClientWebSocket webSocket)
    {
        while (webSocket.State == WebSocketState.Open)
        {
            string message = Console.ReadLine();
            byte[] buffer = Encoding.UTF8.GetBytes(message);
            await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}
