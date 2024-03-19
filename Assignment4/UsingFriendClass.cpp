public class Person {
    private String name;
    private int age;
    
    private static class Friend {
        static void setName(Person person, String name) {
            person.name = name;
        }

        static void setAge(Person person, int age) {
            person.age = age;
        }
    }    
    public void setInfo(String name, int age) {
        Friend.setName(this, name);
        Friend.setAge(this, age);
    }
    
    public void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
    }

    public static void main(String[] args) {
        Person person = new Person();
        person.setInfo("Tim", 23);
        person.displayInfo();
    }
}
