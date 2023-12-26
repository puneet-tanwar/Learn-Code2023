public class Rectangle {
    private double length;
    private double width;
    private double area;

    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
        this.area = calculateArea();
    }

    public double calculateArea() {
        this.area = this.length * this.width;
        return this.area;
    }

    public void printArea() {        
        System.out.println("Area: " + this.area);
    }

    public static void main(String[] args) {
        Rectangle rectangle = new Rectangle(5.0, 3.0);
        rectangle.printArea();
    }
}
