using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using chat_client_terminal;
using Microsoft.VisualBasic;

public class ConectDataViewModel
{
    public string clientId { get; set; }
    public string roomId { get; set; }
}

public class WSSendViewModel
{
    public string message { get; set; }
    public string roomId { get; set; }
    public string clientId { get; set; }
}

public class WebSocketClient
{
    private const string ServerUri = "ws://localhost:5004/";

    public string ClientId { get; set; }
    public string RoomId { get; set; }
    private ClientWebSocket webSocket;

    public WebSocketClient(string clientId, string roomId)
    {
        ClientId = clientId;
        RoomId = roomId;
    }

    public async Task Connect()
    {
   

        ;


        webSocket = new ClientWebSocket();
        Task connect =  webSocket.ConnectAsync(new Uri(ServerUri), CancellationToken.None);
        Console.WriteLine("Connected to WebSocket server.");
        Task.WaitAll(connect);


        // Start receiving and sending messages
         
        // Task sendingTask = StartSending(webSocket);

        // Wait for both tasks to complete
        
        await Task.WhenAll(  connect);

       // await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
    }

    private async Task StartReceiving(ClientWebSocket webSocket)
    {
        Console.WriteLine("Start recieving");
        byte[] buffer = new byte[1024];

        
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
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

    private async Task StartSending(ClientWebSocket webSocket)
    {
        while (webSocket.State == WebSocketState.Open)
        {
            Console.WriteLine("Send a message: ");
            string message = Console.ReadLine();
            WSSendViewModel sendObject = new WSSendViewModel
            {
                clientId = ClientId,
                roomId = RoomId,
                message = message

            };
            string messageToSend = JsonSerializer.Serialize(sendObject);

            byte[] buffer = Encoding.UTF8.GetBytes(messageToSend);
            await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    public async Task SendMessage(string message)
    {
        if (webSocket.State != WebSocketState.Open) throw new Exception("Ws state is cloed!");
        WSSendViewModel sendObject = new WSSendViewModel
        {
            clientId = ClientId,
            roomId = RoomId,
            message = message

        };
        string messageToSend = JsonSerializer.Serialize(sendObject);
        byte[] buffer = Encoding.UTF8.GetBytes(messageToSend);
        await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);

        Task receivingTask = StartReceiving(webSocket);
        Task.WaitAll(receivingTask);
        

    }

 }
