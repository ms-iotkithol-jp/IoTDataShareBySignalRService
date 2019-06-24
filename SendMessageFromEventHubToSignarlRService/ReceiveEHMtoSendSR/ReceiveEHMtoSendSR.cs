using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.EventHubs;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;

namespace ReceiveEHMtoSendSR
{
    public static class ReceiveEHMtoSendSR
    {
        [FunctionName("Receive")]
        public static async Task Run(
            [EventHubTrigger("datasource", Connection = "receiverConnectionString")] EventData[] events,
            [SignalR(HubName = "DataShare", ConnectionStringSetting = "SignalRConnectionString")]IAsyncCollector<SignalRMessage> signalRMessages, 
            ILogger log)
        {
            log.LogInformation("Invoked Receive with {0} messages", events.Length);
            var exceptions = new List<Exception>();
            string nowVal = System.DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");

            foreach (EventData eventData in events)
            {
                try
                {
                    string messageBody = Encoding.UTF8.GetString(eventData.Body.Array, eventData.Body.Offset, eventData.Body.Count);

                    // Replace these two lines with your processing logic.
                    log.LogInformation($"C# Event Hub trigger function processed a message: {messageBody}");
                    var messageJson = Newtonsoft.Json.JsonConvert.DeserializeObject(messageBody);
                    var signalRMsg = new
                    {
                        arrived = nowVal,
                        message = messageJson
                    };
                    await signalRMessages.AddAsync(new SignalRMessage()
                    {
                        Target = "SendData",
                        Arguments = new[] { Newtonsoft.Json.JsonConvert.SerializeObject(signalRMsg) }
                    }
                    );
                    log.LogInformation("Send data to SignalR - done");

                    await Task.Yield();
                }
                catch (Exception e)
                {
                    // We need to keep processing the rest of the batch - capture this exception and continue.
                    // Also, consider capturing details of the message that failed processing so it can be processed again later.
                    exceptions.Add(e);
                }
            }

            // Once processing of the batch is complete, if any messages in the batch failed processing throw an exception so that there is a record of the failure.

            if (exceptions.Count > 1)
                throw new AggregateException(exceptions);

            if (exceptions.Count == 1)
                throw exceptions.Single();
        }
    }
}
