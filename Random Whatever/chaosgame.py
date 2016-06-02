import turtle, random, math
    
def sierpinskitriangle(s,t,e,length):
    s1 = length[0] 
    s2 = length[1]
    s3 = length[2]
    a1 = math.degrees(math.acos(-((s1 - (s2 ** 2) - (s3 ** 2))/(2 * s2 * s3))))
    a2 = math.degrees(math.acos(-((s2 - (s1 ** 2) - (s3 ** 2))/(2 * s1 * s3))))
    a3 = math.degrees(math.acos(-((s3 - (s1 ** 2) - (s2 ** 2))/(2 * s1 * s2))))
    h = s2/math.sin(a1)
    # centering the triangle
    t.pencolor('#FFFFFE')
    t.right(90)
    t.forward(h/2)
    t.left(90)
    t.fillcolor('#FFFFFE')
    t.begin_fill()
    t.forward(s3/2)
    t.pencolor('#000000')
    t.dot()
    v3 = t.pos()
    t.pencolor('#FFFFFE')
    t.left(180-a1)    
    t.forward(s2)
    t.pencolor('#000000')
    t.dot()
    v2 = t.pos()
    t.pencolor('#FFFFFE')
    t.left(180-a3)
    t.forward(s1)
    t.pencolor('#000000')
    t.dot()
    v1 = t.pos()
    t.pencolor('#FFFFFE')
    t.left(180-a2)
    t.forward(s3/2)
    t.end_fill()
    def findrpt():
        randx = random.randrange(v1[0],v3[0])
        randy = random.randrange(v1[1], v2[1])
        t.goto(randx,randy)
        if s.bgcolor == '#FFFFFE':
            t.pencolor('#000000')
            t.dot()
            randpoint = t.pos()
        elif s.bgcolor == 'FFFFFF':
            findrpt()
    vertices = [v1,v2,v3]
    def runhalfway():
        randvert = random.choice(vertices)
        whole = turtle.distance(randvert)
        half = whole/2
        t.setheading(randvert)
        t.pencolor('#FFFFFE')
        t.forward(half)
        t.pencolor('#000000')
        t.dot()
        t.pencolor('#FFFFFE')
    for _ in range(e):
        runhalfway()

def regularchaos(s,t,n,e):
    t.penup()
    t.hideturtle()
    t.right(90)
    t.forward(200)
    t.right(90)
    t.forward(200)
    t.left(90)
    t.pendown()
    t.dot()
    ipt = t.pos()
    vertices = [ipt]
    exangle = 180 - ((n - 2) * 180/n)
    radangle = math.radians(180/n)
    length = 400 * math.sin(radangle)
    angle1 = exangle + 90
    t.fillcolor('#FFFFFE')
    t.pencolor('#FFFFFE')
    t.begin_fill()
    t.right(angle1)
    t.forward(length)
    # radius given length of a side is [radius = s/(2sin(180/n))], so given a radius 200, the length of the side is what I have there
    def drawpolygon():
        t.right(exangle)
        t.forward(length)
        t.pencolor('#000000')
        t.dot()
        t.pencolor('#FFFFFE')
    while (n>0):
        drawpolygon()
        vertices.append(t.pos)
        n = n-1
    t.end_fill()
    t.right(exangle/2)
    t.forward(200)
    trlimit = t.pos()
    t.right(90)
    t.forward(400)
    t.right(90)
    t.forward(400)
    bllimit = t.pos()
    def findrpt():
        randx = random.randrange(bllimit[0], trlimit[0])
        randy = random.randrange(bllimit[1], trlimit[1])
        t.goto(randx,randy)
        if s.bgcolor == '#FFFFFE':
            t.dot()
            randpoint = t.pos()
        elif s.bgcolor == 'FFFFFF':
            findrpt()
    findrpt()
    def runhalfway():
        randvert = random.choice(vertices)
        whole = turtle.distance(randvert)
        half = whole/2
        t.setheading(randvert)
        t.pencolor('#FFFFFE')
        t.forward(half)
        t.pencolor('#000000')
        t.dot()
        t.pencolor('#FFFFFE')
    for _ in range(e):
        runhalfway()
    
def main():
    print (":: Chaos Game Programs ::\nThe first [1] one runs a Sierpinski's triangle based on vertices that are all click-based. The second [2] is the"+'"truer" version that has vertices based on a regular polygon.')
    choice = int(input("Input the integer of your choice: "))
    # e = extent, as in how many points to plot after however many vertices and then the one random point
    if choice == 1:
        s1 = float(input("What do you want the first side length to be?"))
        s2 = float(input("What do you want the first side length to be?"))
        s3 = float(input("What do you want the first side length to be?"))
        length = [s1,s2,s3]
        length = length.sort()
        if (length[0] + length[1]) >= length[2]:
            sierpinskitriangle(s,t,e,length)
            turtle.setup(900,700)
            s = turtle.Screen()
            t = turtle.Turtle()
            e = 1000
            t.speed(0)
            s.mainloop()
        else:
            print ("Please enter a valid triangle.")
            choice = 1
            main()

    elif choice == 2:
        print ("Enter an integer value for the number of sides of the regular polygon. ")
        n = int(input())   
        turtle.setup(900,700)
        s = turtle.Screen()
        t = turtle.Turtle()
        e = 1000
        t.speed(0)
        regularchaos(s,t,n,e)
        s.mainloop()
            
            
main()