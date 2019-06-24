using Microsoft.Azure.EventHubs;
using System;
using System.Collections.Generic;
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
            var connectionStringBuilder = new EventHubsConnectionStringBuilder(ehConnectionString)
            {
                 EntityPath=ehName
            };
            eventHubClient = EventHubClient.CreateFromConnectionString(connectionStringBuilder.ToString());
            random = new Random(DateTime.Now.Millisecond);
        }

        readonly string ehConnectionString = "< Event Hub Connection String >";
        readonly string ehName = "datasource";
        EventHubClient eventHubClient;
        Random random;

        private async void ButtonSend_Click(object sender, RoutedEventArgs e)
        {
            var data = new
            {
                x = random.Next(10),
                y = random.Next(10)
            };

            var message = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            var ehMsg = new EventData(Encoding.UTF8.GetBytes(message));
            await eventHubClient.SendAsync(ehMsg);
        }
    }
}
