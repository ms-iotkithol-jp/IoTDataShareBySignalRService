using Microsoft.Azure.EventHubs;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace WpfAppSendTest
{
    /// <summary>
    /// MainWindow.xaml の相互作用ロジック
    /// </summary>
    public partial class MainWindow : Window
    {
        
        public MainWindow()
        {
            InitializeComponent();
            this.Loaded += MainWindow_Loaded;
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            tbCS.Text = ConfigurationManager.ConnectionStrings["eventhub-connectionstring"].ConnectionString;
            tbDeviceId.Text = "device1";

            random = new Random(DateTime.Now.Millisecond);
        }

        readonly string ehName = "datasource";
        EventHubClient eventHubClient;
        Random random;

        private double lastTemperature = 20;
        private double lastHumidity = 50;
        private double lastPressure = 1000;
        private async void ButtonSend_Click(object sender, RoutedEventArgs e)
        {
            var data = new
            {
                deviceid = tbDeviceId.Text,
                temperature = lastTemperature,
                humidity = lastHumidity,
                pressure = lastPressure,
                measured_time = DateTime.Now.ToString("yyyy/MM/ddTHH:mm:ss")
            };

            var message = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            var ehMsg = new EventData(Encoding.UTF8.GetBytes(message));
            await eventHubClient.SendAsync(ehMsg);

            var sb = new StringBuilder(tbLog.Text);
            var writer = new StringWriter(sb);
            writer.WriteLine($"Send - {message}");
            tbLog.Text = sb.ToString();

            lastTemperature += (1 - 2 * random.NextDouble());
            lastHumidity += (1 - 2 * random.NextDouble());
            if (lastHumidity > 100)
            {
                lastHumidity = 100;
            }
            else if (lastHumidity < 0)
            {
                lastHumidity = 0;
            }
            lastPressure += (1 - 2 * random.NextDouble());
        }

        private void buttonConnect_Click(object sender, RoutedEventArgs e)
        {
            var connectionStringBuilder = new EventHubsConnectionStringBuilder(tbCS.Text)
            {
                EntityPath = ehName
            };
            eventHubClient = EventHubClient.CreateFromConnectionString(connectionStringBuilder.ToString());
            buttonSend.IsEnabled = true;

        }

        private void buttonClearLog_Click(object sender, RoutedEventArgs e)
        {
            tbLog.Text = "";
        }
    }
}
