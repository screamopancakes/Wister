s = "Ich wünsche Ihnen einen guten Tag!" # initialize initial string
ls = s.split()  # split by spaces into a list, and since spaces are characters between words, this effectively separates the list by words: ls = ['Ich', 'wünsche', 'Ihnen', 'einen', 'guten', 'Tag!']
s2 = '~'.join(ls) # s2 = "Ich~wünsche~Ihnen~einen~guten~Tag!"
print (s2)