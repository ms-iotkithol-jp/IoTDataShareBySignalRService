# テスト用ツール 
## WpfAppSendTest 
Event Hub にメッセージをテスト的に送るツール 
Visual Studio 2017以上で、WpfAppSendTest.csprojを開く。 
MainWindow.xaml.cs の41行目、
```c# 

        readonly string ehConnectionString = "< Event Hub Connection String >";
        readonly string ehName = "datasource";
```
の \< Event Hub Connection String \> を、各自のEvent Hubの接続文字列で書き換える 
実行して、ボタンをクリック。 
