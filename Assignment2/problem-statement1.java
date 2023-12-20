public class Operation {
    int operandOne;
    double operandTwo;
    String baseString;

    public void printSum(int operandOne, int operandTwo) {
        int sum = operandOne + operandTwo;
        System.out.println("Result: " + sum);
    }

    public void printUppercasedString(String inputString) {
        baseString = inputString.toUpperCase();
        System.out.println("Updated String: " + baseString);
    }
}

public class operationProgram {
    public static void main(String[] args) {
        Operation operation = new Operation();
        operation.operandOne = 10;
        operation.operandTwo = 20.5;
        operation.baseString = "hello";
        
        operation.printSum(operation.operandOne, 5);
        operation.printUppercasedString("world");
    }
}