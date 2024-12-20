import React from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';

const TradingViewChart = ({ symbol }) => {
  const theme = useTheme();
  
  const chartHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
        <style>
          body { margin: 0; }
          #container { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="container"></div>
        <script type="text/javascript">
          new TradingView.widget({
            "width": "100%",
            "height": "100%",
            "symbol": "BINANCE:${symbol}",
            "interval": "15",
            "timezone": "exchange",
            "theme": "${theme.dark ? 'dark' : 'light'}",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "${theme.dark ? '#2A2A2A' : '#F1F3F6'}",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": "container"
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: chartHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
  },
  webview: {
    flex: 1,
  },
});

export default TradingViewChart;
