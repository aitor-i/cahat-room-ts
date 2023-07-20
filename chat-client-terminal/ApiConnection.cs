using System;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

namespace chat_client_terminal
{
	public class ApiConnection
	{

		static string BaseUrl;
		static HttpClient _HttpClient;


		public ApiConnection(string baseUrl)
		{
			BaseUrl = baseUrl;
			_HttpClient = new HttpClient();
		}

		public async Task PostData (PostObject PostObject)
		{
			string postEndpoint = BaseUrl + PostObject.Endpoint;
			string jsonString = JsonSerializer.Serialize(postEndpoint);

            var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, postEndpoint);
            request.Headers.Add("Accept", "application/json");
            request.Content = content;

            var res = await _HttpClient.SendAsync(request);


        }


    }

	public class PostObject
	{
		public string Endpoint { get; set; }
		public object DataToPost { get; set; }

	}
}

