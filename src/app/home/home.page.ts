import { Component } from '@angular/core';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { BluetoothSerial } from 'bluetooth-serial';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  MAC_ADDRESS = '41:1D:2A:18:53:0E'; // check your mac address in listDevices or discoverUnpaired
  constructor() {
    let encoder = new EscPosEncoder();

    let result = encoder
      .initialize()
      .text('The quick brown fox jumps over the lazy dog')
      .newline()
      .qrcode('https://nielsleenheer.com')
      .encode();

    console.log(result);

  }


  listDevices(){
    console.log("LIST DEVICES");
    BluetoothSerial.list().then(function({devices}) {
      devices.forEach(function(device: any) {
        console.log("Device id: ", device.id);
        console.log("Device name: ", device.name);
      })
    }).catch((e) =>{
      console.error(e);
    });
  }

  discoverUnpaired(){
    console.log("LIST UNPAIRED DEVICES");
    BluetoothSerial.discoverUnpaired().then(function({devices}) {
      devices.forEach(function(device: any) {
        console.log("Unpaired device ID: ", device.id);
        console.log("Unpaired device NAME: ", device.name);
      })
    }).catch((e) => {
      console.error(e);
    });
  }

  demoPrint(){
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();

    result
      .codepage('windows1250')
      .align('center')
      .newline()
      .line('Congratulation, print success')
      .line('Bluetooth MAC :')
      .line('Bluetooth MAC : ' + this.MAC_ADDRESS)
      .newline()
      .newline()
      .align('left')
      .qrcode('https://maliured.hr')
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    const resultByte = result.encode();

    // send byte code into the printer
    BluetoothSerial.connect({
      address: this.MAC_ADDRESS
    }).then(() => {
      BluetoothSerial.write(resultByte)
        .then(() => {
          BluetoothSerial.clear();
          BluetoothSerial.disconnect();
          console.log('Print success');
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
}
