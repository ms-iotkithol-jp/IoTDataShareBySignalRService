using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace SignalRDataShare
{
    public static class Hubs
    {
        [FunctionName("SignalRInfo")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req,
            [SignalRConnectionInfo(HubName = "DataShare")] SignalRConnectionInfo connectionInfo,
            ILogger log)
        {
            log.LogInformation("Invoked negotiate");
            return new OkObjectResult(connectionInfo);
        }
        /*
        [FunctionName("negotiate")]
        public static async Task<IActionResult> GetSignalRInfo(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
            [SignalRConnectionInfo(HubName = "DataShare")] SignalRConnectionInfo info,
            ILogger log)
        {
            log.LogInformation("Invoked negotiate");
            return new OkObjectResult(info);
        }
        */
        /*
        [FunctionName("update")]
        public static Task SendMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous,"post")] object message,
            [SignalRConnectionInfo(HubName ="DataShare")]SignalRConnectionInfo info,
            IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            log.LogInformation("Invoked update - message : " + message.ToString());
            return signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = "notify",
                    Arguments = new[] { message }
                });
        }
        */

    }
}
