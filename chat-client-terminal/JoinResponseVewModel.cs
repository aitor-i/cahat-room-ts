using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chat_client_terminal
{
    public class JoinResponseVewModel
    {
        public string roomId { get; set; }
        public string userId { get; set;}
        public List<Message> messages { get; set;}
    }

      public class Message
    {
        public string message { get; set; }
        public Client client { get; set; }
    }

    public class Client
    {
        public string name { get; set; }
        public string id { get; set; }
    }
}