public class SmartphoneFactory extends DeviceFactory{
    @Override
    public Device createDevice() {
        return new Smartphone();
    }
}