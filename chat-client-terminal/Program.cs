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

        static async Task ChatApp() {
            Console.WriteLine("# ######################### #");
            Console.WriteLine("# Hello this is chat rooms! #");
            Console.WriteLine("# ######################### # \n \n");

            Console.WriteLine("Please enter your name: ");
            string username = Console.ReadLine();

            Console.WriteLine($"Hello {username}!");
            Console.WriteLine("Please enter a room name: ");
            string roomName = Console.ReadLine();

            PostObject dataToPost = new PostObject
            {
                DataToPost = new {username, roomName },
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



            var webSocketClient = new WebSocketClient(responseObject.userId, responseObject.roomId);
            await webSocketClient.Connect();

            while (true)
            {
                Console.WriteLine("Send a message: ");
                string message = Console.ReadLine();
                await webSocketClient.SendMessage(message);

            }


        }



        static async Task<JoinResponseVewModel> PostJoinData (string username, string roomName){

            HttpClient httpClient = new HttpClient();
            JoinResponseVewModel responseObject = new JoinResponseVewModel();


            try
            {
                RequestVewModel reqObject = new RequestVewModel{
                    username = username,
                    roomName = roomName
                };
                string jsonString = JsonSerializer.Serialize(reqObject);
                string apiUrl =  "http://localhost:5004/join";


                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, apiUrl);
                request.Headers.Add("Accept", "application/json");
                var content = new StringContent( jsonString , Encoding.UTF8, "application/json");
                request.Content = content;

                HttpResponseMessage response;

                    HttpResponseMessage res = await httpClient.SendAsync(request);
                    response = res;
                Console.WriteLine(response.IsSuccessStatusCode);

                if (response.IsSuccessStatusCode)
                {
                    string responseContent = await response.Content.ReadAsStringAsync();

                     responseObject =  JsonSerializer.Deserialize<JoinResponseVewModel>(responseContent);

                    

                    if (responseObject.messages.ToArray().Length != 0)
                    {
                        foreach (var message in responseObject.messages)
                        {
                            
                            Console.WriteLine($"{message.client.name}: {message.message}");
                        }
                    }
                    else
                    {
                        Console.WriteLine("No messages yet...");
                    }


                }
                else
                {
                    Console.WriteLine("POST request failed. Status code: " + response.StatusCode);
                }


            }
            catch (System.Exception ex)
            {
                Console.WriteLine("******************");
                Console.WriteLine("An error ocurred");
                Console.WriteLine("******************");

                Console.WriteLine(ex.Message);

                
            }

            
            return responseObject;

        }
    }
    
}
