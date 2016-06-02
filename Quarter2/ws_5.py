'''
Name: Rebekah Arruda
Worksheet 5
Collaborator(s): --
'''


'''compare and contrast questions'''

# class & object : An object is a specific instance class. For instance, Turtle is a class and moe = turtle.Turtle(), moe is an object.

# attribute & method : An attribute is a trait and a method is a way to manipulate the traits of an object. For instance, with a Turtle "t", t.pos() returns an attribute, the position of the turtle, but something like t.goto(x,y) changes the position of the turtle.

# functional programming & object-oriented programming : functional programming is focused on using functions for accomplishing tasks and manipulating data, while object-oriented programming has the focus on using attributes and methods to manipulate data.

# function composition & object composition : function composition, like in math, allows one to make a more complex function out of many simpler ones. Object composition, likewise, is a way to make more complex objects out of simpler ones. The difference between them is that functions and objects are not the same. Objects, in a way, are more inclusive than functions. All functions are objects, as they take up memory somewhere, but not all objects are functions; not all take an input and produce an output.


class Person:
    # constructor
    def __init__(self, n="Anonymous", a="of an unknown age"):
        self.name = n
        self.age = a
        self.hobbies = []
    
    def __int__( self, a ):
        return a
    # string casting method
    def __str__(self, n):
        return self.name

    def say_hello( self ):
        print ("My name is",self.name,"and I am",str(self.age)+".")
        hobbs = len(self.hobbies)
        if (hobbs == 0):
            pass
        elif hobbs == 1:
            print ("I like",self.hobbies[0]+".")
        elif hobbs == 2:
            print ("I like",self.hobbies[0],"and",self.hobbies[1]+".")
        elif hobbs > 2:    
            print( "I like", end=' ')
            for x in range(hobbs - 1):
                print( self.hobbies[x], end=', ')
            print("and",self.hobbies[-1]+".")

    def add_hobby( self, h ):
        self.hobbies.append( h )
        

    def add_hobbies(self, hl):
        for x in hl:
            self.hobbies.append(x)

def main():
    anon = Person()
    bill = Person("Bill")
    carl = Person("Carl",74)
    dave = Person("Dave",36)
    dave.add_hobby("drawing")
    dave.add_hobby("dancing")
    ed = Person("Edgar",44)
    ed.add_hobbies(['eggplant','elephants','eggs'])
    persons = [anon, bill, carl, dave, ed]
    for p in persons:
        p.say_hello()
        print()


if __name__=="__main__":
    main()