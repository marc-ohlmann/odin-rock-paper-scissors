
// Choices
const c_ChoiceID_Rock = 1;
const c_ChoiceID_Paper = 2;
const c_ChoiceID_Scissors = 3;
const c_Choices = [c_ChoiceID_Rock, c_ChoiceID_Paper, c_ChoiceID_Scissors];
const c_Choice_Count = c_Choices.length;


function IsValidChoice(Choice)
{
    switch(Choice)
    {
        case c_ChoiceID_Rock:
        case c_ChoiceID_Paper:
        case c_ChoiceID_Scissors:
            return true;

        default:
            return false;
    }
}


function ChoiceToString(Choice)
{
    switch(Choice)
    {
        case c_ChoiceID_Rock:
            return "rock";

        case c_ChoiceID_Paper:
            return "paper";

        case c_ChoiceID_Scissors:
            return "scissors";


        default:
            return "none";
    }
}


function StringToChoice(str)
{
    for(var i = 0; i < c_Choices.length; i++)
    {
        var ChoiceIterator = c_Choices[i];
        var ChoiceString = ChoiceToString(ChoiceIterator);
        if(str == ChoiceString)
        {
            return c_Choices[i];
        }
    }


    return -1;
}


function InputToChoice(Input)
{
    return StringToChoice(String(Input).toLowerCase());
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


function GetRandomChoiceString()
{
    return ChoiceToString(GetRandomChoice());
}


function DoesChoiceBeatOtherChoice(Choice, OtherChoice)
{
    if(Choice == OtherChoice)
    {
        return false;
    }

    switch(Choice)
    {
        case c_ChoiceID_Rock:
            switch(OtherChoice)
            {

                case c_ChoiceID_Paper:
                    return false;

                case c_ChoiceID_Scissors:
                    return true;


                default:
                    return false;
            }

        case c_ChoiceID_Paper:
            switch(OtherChoice)
            {
                case c_ChoiceID_Rock:
                    return true;

                case c_ChoiceID_Scissors:
                    return false;


                default:
                    return false;
            }
            break;

        case c_ChoiceID_Scissors:
            switch(OtherChoice)
            {
                case c_ChoiceID_Rock:
                    return false;

                case c_ChoiceID_Paper:
                    return true;


                default:
                    return false;
            }
            break;

        default:
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
        case c_ChoiceID_Rock:
            DecisionCount_Rock++;
            break;

        case c_ChoiceID_Paper:
            DecisionCount_Paper++;
            break;

        case c_ChoiceID_Scissors:
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
        return c_ChoiceID_Rock;
    }
    else if( DecisionCount_Paper < DecisionCount_Rock && 
        DecisionCount_Paper < DecisionCount_Scissors)
    {
        return c_ChoiceID_Paper;
    }
    else if( DecisionCount_Scissors < DecisionCount_Paper && 
        DecisionCount_Scissors < DecisionCount_Rock)
    {
        return c_ChoiceID_Scissors;
    }


    // just pick a random one
    return GetRandomChoice()
}


// games, matches, and results
const c_ResultString_Win = "win";
const c_ResultString_Lose = "lose";
const c_ResultString_Tie = "tie";

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
            ChoiceToString(ChallengingPlayerChoice) + 
            " versus " +
            ChoiceToString(OtherPlayerChoice);
    }
    else if(result == c_ResultString_Win)
    {
        return c_ResultString_Win +
            "! " +
            ChoiceToString(ChallengingPlayerChoice) + 
            " beats " +
            ChoiceToString(OtherPlayerChoice);
    }
    else
    {
        return c_ResultString_Lose +
            "! " +
            ChoiceToString(OtherPlayerChoice) + 
            " beats " +
            ChoiceToString(ChallengingPlayerChoice);
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

const c_GameMatchCount = 5;
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