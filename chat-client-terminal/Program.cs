using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using chat_client_terminal;
using System.Text.Json;


namespace chat_client_terminal
{
    class Program
    {
        static string Username { get; set; }
        static string RoomName { get; set; }


        static void Main(string[] args)
        {
            while (true)
            {
                ChatRun();

            }
        }

        static async void ChatRun()
        {
            try
            {              
                await ChatApp();
            }
            catch (Exception ex)
            {
                Console.WriteLine("******************");
                Console.WriteLine("An error ocurred");
                Console.WriteLine("******************");
                Console.WriteLine(ex.Message.ToString());
            }
        }

        static void PrintTitle()
        {
            Console.WriteLine("# ######################### #");
            Console.WriteLine("# Hello this is chat rooms! #");
            Console.WriteLine("# ######################### # \n \n");
        }
        static void CollectUsernameAndRoomName()
        {
            Console.WriteLine("Please enter your name: ");
            string username = Console.ReadLine();

            Console.WriteLine($"Hello {username}!");
            Console.WriteLine("Please enter a room name: ");
            string roomName = Console.ReadLine();

            Program.Username = username;
            Program.RoomName = roomName;
        }

        class JoinObject
        {
            public string username { get; set; }
            public string roomName { get; set; }
        }

        static async Task ChatApp() {

            if(Username==null && RoomName == null)
            {
                PrintTitle();
                CollectUsernameAndRoomName();

            }

            PostObject dataToPost = new PostObject
            {
                DataToPost = new JoinObject {username=Program.Username, roomName = Program.RoomName },
                Endpoint = "/join"
            };
            ApiConnection apiConnection = new ApiConnection("http://localhost:5004");
            var postResponse = await apiConnection.PostData(dataToPost);
            var data = await postResponse.ReadAsStringAsync();
            JoinResponseVewModel responseObject = JsonSerializer.Deserialize<JoinResponseVewModel>(data);

            foreach (Message message in responseObject.messages)
            {
                Console.WriteLine($"{message.client.name}:   {message.message}");
            }

            Task chatActionsPromese = ChatActions(responseObject.userId, responseObject.roomId);
            await Task.WhenAll(chatActionsPromese);
            Console.WriteLine("^^^^^ Chat pass!!! ^^^^^^^");

            //var wsClient = new NewWSClient(responseObject.userId, responseObject.roomId);

            //await wsClient.Connect();
            
            //while (true)
            //{

            //   await wsClient.StartReceiving();
            //    Console.WriteLine("========");
            //    //wsClient.StartSending();

            //}

            

            //var webSocketClient = new WebSocketClient(responseObject.userId, responseObject.roomId);
            //await webSocketClient.Connect();

            //while (true)
            //{
            //    Console.WriteLine("Send a message: ");
            //    string message = Console.ReadLine();
            //    await webSocketClient.SendMessage(message);

            //}


        }

        static async Task ChatActions(string userId, string roomId)
        {
            var wsClient = new NewWSClient(userId, roomId);

            Task coonectionPromise = wsClient.Connect();
            await Task.WhenAll(coonectionPromise);
            Console.WriteLine("Connected!!!");


            Task sendingPromise = wsClient.StartSending();
            Console.WriteLine("Waiting to send");

            Task recievingPromise =  wsClient.StartReceiving();
            Console.WriteLine("Waiting to message");
            Task.WaitAll(recievingPromise);


            await Task.WhenAll(recievingPromise, sendingPromise);
            Console.WriteLine("========");

            
        }

    }
    
}
