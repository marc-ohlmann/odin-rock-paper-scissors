


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


// interactive page 
let WinCount_AI = 0;
let WinCount_Player = 0;

const resultText = document.querySelector('.ResultText');
const winCountText = document.querySelector('.WinCountText');
const loseCountText = document.querySelector('.LoseCountText');


function UpdateCountText()
{
    winCountText.textContent = String(WinCount_Player);
    loseCountText.textContent = String(WinCount_AI);
}


function HandlePlayerInput(PlayerInput)
{
    let result = PlayMatchVersusAI(PlayerInput);
    if(result.includes(c_ResultString_Lose))
    {
        WinCount_AI++;
        resultText.setAttribute('style', 'background-color: lightcoral;');
    }
    else if(result.includes(c_ResultString_Win))
    {
        WinCount_Player++;
        resultText.setAttribute('style', 'background-color: lightgreen;');
    }
    else
    {
        resultText.setAttribute('style', 'background-color: lightgray;');
    }

    resultText.textContent = result;

    UpdateCountText();

    console.log(result);
}


function InputButton_Rock()
{
    HandlePlayerInput(c_Choice_Rock);
}


function InputButton_Paper()
{
    HandlePlayerInput(c_Choice_Paper);
}


function InputButton_Scissors()
{
    HandlePlayerInput(c_Choice_Scissors);
}


function InputButton_Reset()
{
    WinCount_AI = 0;
    WinCount_Player = 0;
    UpdateCountText();
    resultText.textContent = "Make a choice to play";
    ResetAIMemory();
    resultText.setAttribute('style', 'background-color: lightgray;');
}