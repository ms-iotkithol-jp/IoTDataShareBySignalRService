# Hub というか、accessToken を供給する Functions
SignalRDataShare/SignalRDataShare.csproj を Visual Studio で開く。 
ローカルデバッグしたいときには、local.setting.json の Event Hub と、 SignalR Service の接続文字列を、Azure Portal からコピペする。 
Visual Studio で、Azure にデプロイする。 
デプロイした Azure Functions の Web Socket をオンにする。 
Azure Functions の 概要→Function Appの設定→アプリケーション設定の管理で、+新しいアプリケーション設定をクリックして、Event Hub と SignalR Service の接続文字列を登録する。 
- Event Hub → receiverConnectionString で設定 
- SignalR Service → SignalRConnectionString で設定 
