#include <iostream>
#include <string>

using namespace std;

class Person {
    const string name;
    const int age;

public:
    Person(const string& n, int a) : name(n), age(a) {}    

    void displayInfo() {
        cout << "Name: " << name << endl;
        cout << "Age: " << age << endl;
    }
};

int main() {    
    Person person("John", 30);    
    person.displayInfo();    
    return 0;
}
