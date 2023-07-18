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
        static string RoomId{ get; set; }
        static string UserId { get; set; }

        static  void  Main(string[] args)
        {
            
       
                ChatApp();
            
            

        }
        static void ChatApp (){
            Console.WriteLine("# ######################### #");
            Console.WriteLine("# Hello this is chat rooms! #");
            Console.WriteLine("# ######################### # \n \n" );

            Console.WriteLine("Please enter your name: ");
            string username = Console.ReadLine();

            Console.WriteLine($"Hello {username}!");
            Console.WriteLine("Please enter a room name: ");
            string roomName = Console.ReadLine();

            Program.postJoinData(username, roomName);

            Console.WriteLine(roomName);
        }

        static async void  postJoinData (string username, string roomName){

            HttpClient httpClient = new HttpClient();


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

                HttpResponseMessage response = await httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    string responseContent = await response.Content.ReadAsStringAsync();

                    JoinResponseVewModel responseObject = JsonSerializer.Deserialize<JoinResponseVewModel>(responseContent);
                    Program.UserId = responseObject.userId;
                    Program.RoomId = responseObject.roomId;


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

            

        }
    }
}
