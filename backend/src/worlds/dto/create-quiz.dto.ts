export class CreateQuizDto {
    question: string;
    options: string[];
    correctAnswer: string;
    levelId: number;
}