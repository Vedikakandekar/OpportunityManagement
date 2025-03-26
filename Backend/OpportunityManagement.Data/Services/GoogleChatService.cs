using OpportunityManagement.Data.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services
{
    public class GoogleChatService :IGoogleChatService
    {
        private readonly HttpClient _httpClient;
        private readonly string _webhookUrl = "https://chat.googleapis.com/v1/spaces/t_1ursAAAAE/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=sw9Au-8l-DX-SV_OdiWn_p8Xzz1z-45en3FsfZ-52Fg"; // Replace with your Webhook URL

        public GoogleChatService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> SendMessageAsync(string message)
        {
            var payload = new { text = message };
            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_webhookUrl, content);
            return response.IsSuccessStatusCode;
        }
    }
}
