import java.io.FileWriter;
import java.io.IOException;

public class Rectangle {
    private double length;
    private double width;
    private double area;
    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
        this.area = this.calculateArea();
    }
    public double calculateArea() {
        this.area = this.length * this.width;
        return this.area;
    }
    public double saveRectangleAreaToFile() {        
        try (FileWriter writer = new FileWriter("area.txt")) {
            writer.write("Area: " + this.area);
        } catch (IOException e) {
            System.err.println("Error writing to file: " + e.getMessage());
        }        
    }

    public static void main(String[] args) {
        Rectangle rectangle = new Rectangle(5.0, 3.0);
        saveRectangleAreaToFile();
        System.out.println("Calculated Area: " + rectangle.area);
    }
}