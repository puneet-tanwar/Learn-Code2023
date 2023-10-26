#include <iostream>
#include <map>
#include <string>

using namespace std;


map<string, double> emailFootprints = {
    {"Average Inbox", 0.3},
    {"Spam", 0.03},
    {"Large Body Inbox", 11},
    {"Inbox with Attachments", 50},
    {"Average Sent", 0.3},
    {"Large Body Sent", 11}
};

int main() {
    map<string, int> emailCounts;
    
    for (const auto& entry : emailFootprints) {
        string emailType = entry.first;

        if (emailType == "Average Inbox" || emailType == "Average Sent") {
            cout << "Enter the number of " << emailType << " emails: ";
            int count;
            cin >> count;
            emailCounts[emailType] = count;
        } else {
            cout << "Enter the number of " << emailType << " emails: ";
            int count;
            cin >> count;
            emailCounts[emailType] = count;
        }
    }

    
    double totalFootprint = 0.0;
    for (const auto& entry : emailCounts) {
        const string& emailType = entry.first;
        const double footprint = emailFootprints[emailType];
        totalFootprint += footprint * entry.second;
    }

    cout << "Estimated carbon footprint of your email usage: " << totalFootprint << " grams of CO2e." << endl;

    return 0;
}
