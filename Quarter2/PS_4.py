import random
## 
# program memory
##
words = {}      # dictionary to hold word / definition pairs
bag = []        # list to hold undealt letters
players = []    # list to hold players
player = {      # template for a player - each player has a score and a hand
    'score':0,
    'hand':[]
}

##
# Load the dictionary (OWL.txt) into memory
##
def load( filename ):
    d = open('OWL.txt','r')
    keys = []
    defins = []
    for line in d:
        s = line.find(' ')
        key = line[:s]
        keys.append(key)
        defin = line[s:]
        defins.append(defin)
    x = 0
    while x < (len(keys)):
        words[keys[x]] = defins[x]
        x = x + 1

##
# Find the parameter 'word' in the dictionary, 
# Return the definition or None if the word is not in the dictionary
# should not be case-sensitive
##
def define(word ):
    word = word.upper()
    if word in words:
        return (words[word])
    else:
        return None

##
# Score a word using Scrabble letter values - sum the point values. 
# Return the points awarded for valid words, or 0 for invalid
##


def score( word ):
    if define(word) == None:
        return 0
    else:
        points = []
        letters = list(word)
        word = word.upper()
        pt1 = ['E','A','I','O','N','R','T','L','S','U']
        pts2 = ['D','G']
        pts3 = ['B','C','M','P']
        pts4 = ['F','H','V','W','Y']
        pts5 = ['K']
        pts8 = ['J','X']
        pts10 = ['Q','Z']
        for letter in word:
            if letter in pt1:
                points.append(1)
            if letter in pts2:
                points.append(2)
            if letter in pts3:
                points.append(3)
            if letter in pts4:
                points.append(4)
            if letter in pts5:
                points.append(5)
            if letter in pts8:
                points.append(8)
            if letter in pts10:
                points.append(10)
        return sum(points)

##
# Return a list of 'n' randomly selected letters.
# BONUS: deal letters from a 'bag' containing the proper quantity of 
#    each letter according to Scrabble distribution.
##
def initbag():
    for _ in range(12):
        bag.append('E')
    for _ in range(9):
        bag.extend(['A','I'])
    for _ in range(8):
        bag.append('O')
    for _ in range(6):
        bag.extend(['N','R','T'])
    for _ in range(4):
        bag.extend(['L','S','U','D'])
    for _ in range(3):
        bag.append('G')
    for _ in range(2):
        bag.extend(['B','C','M','P','F','H','V','W','Y'])
    bag.extend(['K','J','X','Q','Z'])

def deal( n ):
    dealt = []
    bn = len(bag)
    for _ in range(n):
        x = random.randint(0,bn)
        dealt.append(bag[x])
        bag.pop(x)
        bn = len(bag)
    return dealt

##
# Allows the user to 'play' the hand (list of 7 letters)
#    1 - Print the hand
#    2 - Prompt the user for a word
#    3 - Score the word
# If the word is valid, the letters that were played are removed and 
#    new letters are dealt to bring the hand back to 7.
# Return the score.
##

def question(submission):
    if submission[-1] == '?':
        submission = list(submission)
        submission = submission.pop(-1)
        submission = str(submission)
        submission = submission.upper()
        if define(submission) != None:
            print ("This is a valid word.\n",submission,":",define(submission))
            return submission
        elif define(submission) == None:
            return submission
    elif submission[-1] != '?':
        return submission

def playword( hand ):
    print ("What word would you like to play?")
    submission = str(input())
    submission = submission.strip(' ')
    submission = question(submission)
    submission = submission.upper()
    if len(list(submission)) == 1:
        print ("All words must be at least two letters. Please try again.\n")
        play(hand)
    elif define(submission) == None and len(submission) >= 2:
        print ("This is not a valid word. Your turn has ended.")
    elif define(submission) != None:
        avail = hand
        try:
            for letter in submission:
                avail.remove(letter)
            n = 7 - len(avail)
            print ("Your word",submission,"scored",score(submission),"points.")
            for x in deal(n):
                hand.append(x)
                return hand
            print ("This is your new hand:", hand)
        except ValueError:
            print ("Chosen word contains letters that are not in your hand.")


def exchange( hand ):
    x = str(input("Which letters would you like to exchange?\n(Just type it as a nonsense word.)\n"))
    x = x.upper()
    x = list(x)
    dealt = deal(len(x))
    for e in dealt:
        hand.append(e)
    for e in x:
        hand.remove(e)
    return hand

def play( hand ):
    print (hand)
    print ("Would you like to play (p) or exhange (e) all or some of your letters?")
    i = str(input())
    if i == "p":
        playword( hand )
    elif i == "e":
        print ("This is your new hand.\n", exchange(hand),"\nYour turn has ended.")
    else:
        print ("You did not enter a valid option. Please try again.\n\n")
        play( hand )



## 
# Initialize the game.
#    - Prompt the user for number of players / number of rounds
#    - populate the bag of letters
#    - populate the players list and deal 7 letters to each player
##
def init():
    p = str(input("How many players do you want? [MAX 6]: "))
    if p > 6:
        print ("There is a maximum of six, so there will be six players")
        p = 6
    elif p > 1 and p < 6:
        pass
        
    elif p == 1:
        print ("")

##
# Starts a full game.
#    - initialize the game
#    - enter the game loop
# In the game loop.
#    - Player 1 plays and is shown his / her score
#    - Player 2 plays, etc.
##


def game():
    pass

if __name__=="__main__":
    
    load("OWL.txt")
    game()
    initbag()
    play(deal(7))