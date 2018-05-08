# homebridge-esp-co2
This plug-in is based on [UDP Json](https://github.com/rxseger/homebridge-udp-json).

UDP server for receiving JSON messages from remote sensors on your network,
plugin for [Homebridge](https://github.com/nfarina/homebridge)

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g shin4299/homebridge-esp-co2`
3.	Update your configuration file - see below for an example

## Configuration
* `accessory`: "ESPCO2"  ---- Require
* `name`: descriptive name  ---- Require
* `listen_port`: UDP port to listen on for incoming messages   ---- No-Require(default 8268)
* `temperatureOn`: 'true' or 'false'   ---- No-Require(default true)
* `carbonDioxideSet`: Carbon dioxide value for notification   ---- No-Require(default 1200ppm)

Example configuration:
```json
    "accessories": [
        {
            "accessory": "ESPCO2",
            "name": "Bedroom"
        }
    ]
```
or

```json
    "accessories": [
        {
            "accessory": "ESPCO2",
            "name": "Bedroom",
       			"temperatureOn": false,
      			"carbonDioxideSet": 1000,
            "listen_port": 8268
        }
    ]
```

Creates a LightSensor service named Lighting.

Listens for UDP datagrams on port 8268, and reports the light level as the
payload interpreted as an ASCII string representing the light level in lux.


## ESP Easy Controllers Setting
* `Protocol`: generic UDP
* `Locate Controller`: Use IP address
* `Controller IP`: 192.168.1.100 (Your homebridge server IP)
* `Controller Port`: 8268
* `Controller Subscribe`: 
* `Controller Publish`:	{"co2_ppm":%val1%, "temperature_c":%val2%}
* `Enabled`: check

## License

MIT
