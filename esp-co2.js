'use strict';

const dgram = require('dgram');

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-esp-co2', 'ESPCO2', ESPCO2Plugin);
};

class UDPJSONPlugin
{
  constructor(log, config) {
    this.log = log;
    this.temperatureOn = config.temperatureOn;
    this.carbonDioxideSet = config.carbonDioxideSet || 1000;
    this.name = config.name;
    this.name_temperature = config.name_temperature || this.name + 'temp';
    this.name_carbonDioxide = config.name_carbonDioxide || this.name + 'CO2';
    this.listen_port = config.listen_port || 8268;
	  
	this.informationService = new Service.AccessoryInformation();

    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "ESP")
      .setCharacteristic(Characteristic.Model, "ESPEasyCO2")
      .setCharacteristic(Characteristic.SerialNumber, this.device);
	  
   this.temperatureService = new Service.TemperatureSensor(this.name_temperature);	    
    this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({
        minValue: -100,
        maxValue: 100
      });

	  this.carbondioxideService = new Service.CarbonDioxideSensor(this.name_carbonDioxide);   
     

    this.server = dgram.createSocket('udp4');
    
    this.server.on('error', (err) => {
      console.log(`udp server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      console.log(`server received udp: ${msg} from ${rinfo.address}`);

      let json;
      try {
          json = JSON.parse(msg);
      } catch (e) {
          console.log(`failed to decode JSON: ${e}`);
          return;
      }

      const temperature_c = json.temperature_c;
      //const pressure_hPa = json.pressure_hPa; // TODO
      //const altitude_m = json.altitude_m;
      const co2_ppm = json.co2_ppm;
	    
    if (temperature_c > -100) { 
   	this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .setValue(Math.round(temperature_c));
    }	    
    if (co2_ppm > 100) {
	this.carbondioxideService
	.getCharacteristic(Characteristic.CarbonDioxideDetected)
	.setValue(co2_ppm > this.carbonDioxideSet ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL)
	this.carbondioxideService
	.getCharacteristic(Characteristic.CarbonDioxideLevel)
	.setValue(Math.round(co2_ppm))	  
    }

    });

    
    this.server.bind(this.listen_port);

  }

  getServices() {
	  
    if (this.temperatureOn) { 
	    return [this.informationService, this.temperatureService, this.carbondioxideService];
     } else { 
	    return [this.informationService, this.carbondioxideService];
        }
  }
}
