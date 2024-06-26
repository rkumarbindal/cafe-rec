import { question } from 'readline-sync';

class IO {

    print(message: string): void {
        console.log(message);
    }

    printDebug(message: string): void {
        console.log('DEBUG---------');
        console.log(message);
        console.log('DEBUG---------');
    }

    getInput(prompt: string): string {
        return question(prompt);
    }

    showMenu(options: string[]): number {
        console.log('Please choose an option:');
        options.forEach((option, index) => {
            const optionIndex = (index + 1).toString();
            console.log(`${optionIndex}. ${option}`);
        });

        // eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
        while (true) {
            const input = this.getInput('Enter the number of your choice: ');
            const choice = parseInt(input, 10);

            if (this.isInValidInput(choice, options)) {
                console.log('Invalid choice. Please try again.');
            } else {
                return choice;
            }
        }
    }

    private isInValidInput(choice: number, options: string[]): boolean {
        return isNaN(choice) || choice < 1 || choice > options.length;
    }
}

const io = new IO();
export default io;