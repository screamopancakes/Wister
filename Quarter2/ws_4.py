# Name: Rebekah Arruda

def q1a():
    print ("<><><>  <> Printing Letters in a String <>  <><><>")
    s = "string"
    for e in s:
        print (e, end='')

def q1b(s):
    print ("\n\n<><><>  <> Palindromes <>  <><><>")
    allower = s.lower()
    noformat = s.replace(' ','')
    revnoformat = noformat[::-1]
    if noformat == noformat:
        print (s,"is a palindrome.")
    else:
        print (s,"is not a palindrome.")
    
def q1c():
    print ("\n<><><>  <> Replace <>  <><><>")
    story = "<name> did this then <name> did that and clearly I am just way too lazy to write a story now, so perhaps I will later."
    alexstory = story.replace('<name>','Alex')
    print (story, "\n>>>", alexstory)
    
def q1d():
    print ("\n\n<><><>  <> Replace v.2 <>  <><><>")
    story2 = "Continued story from above, <name>  does this and that and still do not have the motivation to write something decent here. <name>  is a beautiful, fantastic human that just prefers to be referred to by the shortened version of their name, <name> ."
    print (story2)
    f = story2.find("<name>")
    while f > -1:
        segment = story2[:f]
        story2 = story2[f+7:]
        print (segment + "Alex", end='')
        f = story2.find("<name>")
    print (story2)

def q1e():
    print ("\n\n<><><>  <> Print Individual Words <>  <><><>")
    satz = 'This is a sentence because it has a subject and a verb, the subject being the pronoun "this" and the verb being "is".'
    index = satz.find(' ')
    while index > -1:
        print (satz[:index])
        satz = satz[(index+1):]

def q2abc():
    print ("\n\n<><><>  <> Dictionaries <>  <><><>")
    dictdeen = {}
    dictdeen['Glubirne'] = 'literal translation: glow pear .:. translation: lightbulb'
    dictdeen['Zweibelturm'] = 'literal translation: onion tower .:. translation: onion dome (as seen in Russian architecture)'
    print ('Glubirne -', dictdeen['Glubirne'],"\n")
    dictdeen.update({
        'Nacktschnecke':'literal translation: naked snail .:. translation: slug',
        'Schildkröte':'literal translation: shield frog .:. translation: turtle',
        'Waschbär':'literal translation: wash bear .:. translation: raccoon'
    })
    for e in sorted(dictdeen):
        print(e, "\t", dictdeen[e])
# q2d: Lists are ordered sets of elements, while dictionaries are unordered. Elements in a list are automatically associated with a number, depending on what order the elements are in. Dictionaries, on the other hand, have their elements be called by strings, as opposed to numbers.

def q3a():
    print ("\n\n<><><>  <> Printing a File <>  <><><>")
    quantum = open('quantum.txt','r')
    for line in quantum:
        line = line.strip()
        print (line)
    quantum.close()
    
def q3bc():

    outfile = open('outfile.txt','w')
    outfile.write("I really have nothing creative to put here.\n")
    outfile.write("It's pretty disappointing.\n")
    outfile.write("And a few lines is three, and this is the third.\n")
    outfile.close()
    # q3c - I think I could have left outfile open, but mh.
    quantum = open('quantum.txt','r')
    outfile = open('outfile.txt','w')
    for line in quantum:
        s = line.find(' ')
        word1 = line[:s]
        word1 = word1.upper()
        outfile.write(word1)
        outfile.write(" ")
    # I think that's all you want?



def main():
    q1a()
    palin = 'A Toyota'
    q1b(palin)
    q1c()
    q1d()
    q2abc()
    q3a()
    q3bc()
    
main()


