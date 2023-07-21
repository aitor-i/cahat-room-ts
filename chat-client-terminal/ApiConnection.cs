using System;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using RestSharp;


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

		public async Task<HttpContent> PostData (PostObject PostObject)
		{
			HttpContent postDataResoponse;
			string postEndpoint = BaseUrl + PostObject.Endpoint;
			string jsonString = JsonSerializer.Serialize(PostObject.DataToPost);


            var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
			HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, postEndpoint);
            request.Headers.Add("Accept", "application/json");
            request.Content = content;

            Task<HttpResponseMessage>  res =  _HttpClient.SendAsync(request);
			Task.WaitAll(res);
			await Task.WhenAny(res);

			var response = await res;

			if (!response.IsSuccessStatusCode) throw new Exception("In successfull post");
			
            postDataResoponse = response.Content;

			return postDataResoponse;

        }

		public async Task FetchData (string endpoint)
		{
			string fetchUrl = BaseUrl + endpoint;

            var client = new RestClient(fetchUrl);
            var request = new RestRequest("", Method.Get);
            Task<RestResponse> response =  client.ExecuteAsync(request);
			Task.WaitAll(response);
			await Task.WhenAny(response);
            var content = await response;


			Console.WriteLine(content.Content);

        }


    }

	public class PostObject
	{
		public string Endpoint { get; set; }
		public object DataToPost { get; set; }

	}
}

