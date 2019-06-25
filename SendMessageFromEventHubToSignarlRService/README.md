# Event Hub からメッセージを受信して、SignalR Serviceに送る 
ReceiveEHMtoSendSR/ReceiveEHMtoSendSR.csproj を Visual Studio で開く。 
ローカルデバッグしたいときには、local.setting.json の Event Hub と、 SignalR Service の接続文字列を、Azure Portal からコピペする。 
Visual Studio で、Azure にデプロイする。 
デプロイした Azure Functions の Web Socket をオンにする。 
Azure Functions の 概要→Function Appの設定→アプリケーション設定の管理で、+新しいアプリケーション設定をクリックして、Event Hub と SignalR Service の接続文字列を登録する。 
- Event Hub → receiverConnectionString で設定 
- SignalR Service → SignalRConnectionString で設定 

※ このプロジェクトは、 Visual Studio の Function テンプレートで、 Event Hub Triggerで作成して、編集 

※ 作成の際、Event Hub への接続文字列の入力を求められるが、そこでは、receiverConnectionString と入力する事。（実際の接続文字列そのものを入力してはいけない）