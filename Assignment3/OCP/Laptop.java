class Laptop implements Device {    
    private String model;
    private String ram;
    private String storage;

    public Laptop(String model, String ram, String storage) {
        this.model = model;
        this.ram = ram;
        this.storage = storage;
    }
    
    @Override
    public void displayDetails() {
        System.out.println("Laptop: " + model + ", RAM: " + ram + ", Storage: " + storage);
    }
}