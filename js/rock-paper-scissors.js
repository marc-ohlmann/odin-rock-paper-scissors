
// Choices
const c_Choice_Null = "None";
const c_Choice_Rock = "Rock";
const c_Choice_Paper = "Paper";
const c_Choice_Scissors = "Scissors";
const c_Choices = [c_Choice_Rock, c_Choice_Paper, c_Choice_Scissors];
const c_Choice_Count = c_Choices.length;

// game / match results
const c_ResultString_Win = "win";
const c_ResultString_Lose = "lose";
const c_ResultString_Tie = "tie";

// number of matches per game
const c_GameMatchCount = 5;


function InputToChoice(Input)
{
    let InputString = String(Input).toLowerCase();

    switch(InputString)
    {
        case c_Choice_Rock.toLowerCase():
            return c_Choice_Rock;

        case c_Choice_Paper.toLowerCase():
            return c_Choice_Paper;

        case c_Choice_Scissors.toLowerCase():
            return c_Choice_Scissors;

        default:
            return c_Choice_Null;
    }
}


function IsValidChoice(Choice)
{
    let choice = Choice;
    switch(choice)
    {
        case c_Choice_Rock:
        case c_Choice_Paper:
        case c_Choice_Scissors:
            return true;

        default:
            console.log("default on choice: " + Choice);
        case c_Choice_Null:
            return false;
    }
}


function IsValidInput(Input)
{
    return IsValidChoice(InputToChoice(Input));
}


function GetRandomChoice()
{
    let random_value = Math.random() * c_Choice_Count;
    let random_index = Math.floor(random_value);
    let random_choice = c_Choices[random_index];


    return random_choice;
}


function DoesChoiceBeatOtherChoice(Choice, OtherChoice)
{
    if(Choice == OtherChoice)
    {
        return false;
    }

    switch(Choice)
    {
        case c_Choice_Rock:
            switch(OtherChoice)
            {

                case c_Choice_Paper:
                    return false;

                case c_Choice_Scissors:
                    return true;


                default:
                    console.log("default on other choice type: " + OtherChoice);
                    return false;
            }

        case c_Choice_Paper:
            switch(OtherChoice)
            {
                case c_Choice_Rock:
                    return true;

                case c_Choice_Scissors:
                    return false;


                default:
                    console.log("default on other choice type: " + OtherChoice);
                    return false;
            }
            break;

        case c_Choice_Scissors:
            switch(OtherChoice)
            {
                case c_Choice_Rock:
                    return false;

                case c_Choice_Paper:
                    return true;


                default:
                    console.log("default on other choice type: " + OtherChoice);
                    return false;
            }
            break;

        default:
            console.log("default on choice type: " + Choice);
            return false;
    }
}


// AI

let DecisionCount_Rock = 0;
let DecisionCount_Paper = 0;
let DecisionCount_Scissors = 0;

// remember the player decision for next time
function CommitPlayerDecisionToMemory(PlayerDecision)
{
    switch(PlayerDecision)
    {
        case c_Choice_Rock:
            DecisionCount_Rock++;
            break;

        case c_Choice_Paper:
            DecisionCount_Paper++;
            break;

        case c_Choice_Scissors:
            DecisionCount_Scissors++;
            break;


        default:
            console.log("default on player decision " + PlayerDecision)
            break;
    }
}


function ResetAIMemory()
{
    DecisionCount_Rock = 0;
    DecisionCount_Paper = 0;
    DecisionCount_Scissors = 0;
}


function GenerateChoiceForAI()
{
    // were dumb, just pick the least selected choice
    if( DecisionCount_Rock < DecisionCount_Paper && 
        DecisionCount_Rock < DecisionCount_Scissors)
    {
        return c_Choice_Rock;
    }
    else if( DecisionCount_Paper < DecisionCount_Rock && 
        DecisionCount_Paper < DecisionCount_Scissors)
    {
        return c_Choice_Paper;
    }
    else if( DecisionCount_Scissors < DecisionCount_Paper && 
        DecisionCount_Scissors < DecisionCount_Rock)
    {
        return c_Choice_Scissors;
    }


    // just pick a random one
    return GetRandomChoice();
}


// games, matches, and results

function GetMatchResult(ChallengingPlayerChoice, OtherPlayerChoice)
{
    if(ChallengingPlayerChoice == OtherPlayerChoice)
    {
        return c_ResultString_Tie;
    }
    else if(DoesChoiceBeatOtherChoice(ChallengingPlayerChoice, OtherPlayerChoice) == true)
    {
        return c_ResultString_Win;
    }
    else
    {
        return c_ResultString_Lose;
    }
}

function PlayMatch_ChoicesFinal(ChallengingPlayerChoice, OtherPlayerChoice)
{
    let result = GetMatchResult(ChallengingPlayerChoice, OtherPlayerChoice);
    if(result == c_ResultString_Tie)
    {
        return c_ResultString_Tie +
            "! " +
            ChallengingPlayerChoice + 
            " versus " +
            OtherPlayerChoice;
    }
    else if(result == c_ResultString_Win)
    {
        return c_ResultString_Win +
            "! " +
            ChallengingPlayerChoice + 
            " beats " +
            OtherPlayerChoice;
    }
    else
    {
        return c_ResultString_Lose +
            "! " +
            OtherPlayerChoice + 
            " beats " +
            ChallengingPlayerChoice;
    }
}


function PlayMatch(ChallengingPlayerInput, OtherPlayerInput)
{
    // process challenging player inputs
    ChallengingPlayerChoice = InputToChoice(ChallengingPlayerInput);
    if(IsValidChoice(ChallengingPlayerChoice) == false)
    {
        return "Invalid challenging player input " + ChallengingPlayerInput;
    }

    // process other player inputs
    OtherPlayerChoice = InputToChoice(OtherPlayerInput);
    if(IsValidChoice(OtherPlayerChoice) == false)
    {
        return "Invalid other player input " + OtherPlayerInput;
    }


    return PlayMatch_ChoicesFinal(ChallengingPlayerChoice, OtherPlayerChoice);
}


function PlayMatchVersusAI(ChallengingPlayerInput)
{
    // process challenging player inputs
    ChallengingPlayerChoice = InputToChoice(ChallengingPlayerInput);
    if(IsValidChoice(ChallengingPlayerChoice) == false)
    {
        return "Invalid challenging player input " + ChallengingPlayerInput;
    }

    // ai player makes decision at same time as player
    AI_Choice = GenerateChoiceForAI();

    // ai remembers their own choice
    CommitPlayerDecisionToMemory(AI_Choice);

    // ai can only know the player's decision after they make theirs
    CommitPlayerDecisionToMemory(ChallengingPlayerChoice);


    return PlayMatch_ChoicesFinal(ChallengingPlayerChoice, AI_Choice)
}


function PlayGame()
{
    let WinCount_AI = 0;
    let WinCount_Player = 0;

    for(let i = 0; i < c_GameMatchCount; i++)
    {
        PlayerInput = "";
        while(IsValidInput(PlayerInput) == false)
        {
            PlayerInput = prompt();
        }

        let result = PlayMatchVersusAI(PlayerInput);
        console.log("Round " + String(i + 1) + ": " + result);

        if(result.includes(c_ResultString_Lose))
        {
            WinCount_AI++;
        }
        else if(result.includes(c_ResultString_Win))
        {
            WinCount_Player++;
        }
    }

    if(WinCount_AI == WinCount_Player)
    {
        console.log("You tied the game!");
    }
    else if(WinCount_Player > WinCount_AI)
    {
        console.log("You won the game!");
    }
    else
    {
        console.log("You lost the game!");
    }
}