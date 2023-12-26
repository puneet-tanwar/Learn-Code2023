public class Main {
    public static void main(String[] args) {
        SmartphoneFactory smartphoneFactory = new SmartphoneFactory();
        LaptopFactory laptopFactory = new LaptopFactory();

        Device smartphone = smartphoneFactory.createDevice("Model X", "8GB", "128GB");
        
        Device laptop = laptopFactory.createDevice("Laptop Model", "16GB", "256GB");

        smartphone.displayDetails();
        laptop.displayDetails();
    }
}