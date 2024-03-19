#include <iostream>
#include <string>
using namespace std;

class Person {
    public:
        string name;
        int age;
};

int main() {    
    Person person;
    
    person.name = "Tim";
    person.age = 99;

    cout << "Name: " << person.name << endl;
    cout << "Age: " << person.age << endl;

    return 0;
}
