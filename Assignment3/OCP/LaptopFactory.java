public class LaptopFactory extends DeviceFactory{
    @Override
    public Device createDevice() {
        return new Laptop();
    }
}