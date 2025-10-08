const {SerialPort} = require ("serialport");
const {ReadlineParser} = require ("@serialport/parser-readline");
const mqtt = require ("mqtt");

//Porta do arduino (ajuste COM3 no windows ou "/dev/ttyUSB0" no linux)
const port = new SerialPort ({path: "COM5", baudRate: 9600});
const parser = port.pipe(new ReadlineParser ({delimiter: "\n"}));

//conexão ao broker MQTT público HiverMQ
const client = mqtt.connect ("mqtt://broker.hivemq.com:1883");
const topic = "senai/iot/dht11";

client.on("connect", () => {
    console.log("Conectado ao broker MQTT!");

});

parser.on ("data", (line) => {
    try {
        const data = JSON.parser(line.trim());
        console.log ("Recebido:", data);

        client.publish (topic, JSON.stringify(data));
        console.log ("Publicado no MQTT:", data);
    }  catch (err) {
        console.error ("Erro ao parsear", line);
    }
}
)