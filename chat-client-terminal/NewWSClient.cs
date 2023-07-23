using System;
using chat_client_terminal;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Data;
using System.Text.Json;
using System.Collections.Generic;

namespace chat_client_terminal
{
	public class NewWSClient
	{
        public string ClientId { get; set; }
        public string RoomId { get; set; }
        public ClientWebSocket ClientWebSocket { get; set; }

        public NewWSClient(string clientId,string roomId)
        {
            ClientId = clientId;
            RoomId = roomId;
        }
        private const string ServerUri = "ws://localhost:5004/";

        public async Task Connect()
        {
            ClientWebSocket webSocket = new ClientWebSocket();
            ClientWebSocket = webSocket;
            await webSocket.ConnectAsync(new Uri(ServerUri), CancellationToken.None);
            Console.WriteLine("Connected to WebSocket server.");

            // Start receiving and sending messages
            //Task receivingTask = StartReceiving(webSocket);
            //Task sendingTask = StartSending();

            // Wait for both tasks to complete
            // await Task.WhenAll(sendingTask);

        }

        public async Task CloseConnection()
        {

            await ClientWebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
            Console.WriteLine("Connection closed!");
        }

        public async Task StartReceiving()
        {
            byte[] buffer = new byte[1024];

            if (ClientWebSocket.State == WebSocketState.Open)
            {
                WebSocketReceiveResult result = await ClientWebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    string receivedMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    List<Message> parsedMessage = JsonSerializer.Deserialize<List<Message>>(receivedMessage);

                    foreach (var message in parsedMessage)
                    {
                        Console.WriteLine($"{message.client.name}:    {message.message}");
                    }
                }
            }
        }

        public async Task StartSending()
        {
            if (ClientWebSocket.State == WebSocketState.Open)
            {
                Console.WriteLine("Start to read"); // Aqui se va a la mierda
                string message = Console.ReadLine();
                
                WSSendViewModel sendObject = new WSSendViewModel
                {
                    clientId = ClientId,
                    roomId = RoomId,
                    message = message

                };
                string messageToSend = JsonSerializer.Serialize(sendObject);

                byte[] buffer = Encoding.UTF8.GetBytes(messageToSend);
                await ClientWebSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }
}

 
