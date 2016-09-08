# -*- coding: utf-8 -*-
__author__ = 'zhangyu'
import json
#要添加的数据1
fin = file("GDP.json")
inputdata = json.load(fin)
fin.close()
#要添加的数据2
fout = file("tmp.json")
updatedata = json.load(fout)
fout.close()
#最后写入final.json
fre = open("final.json",'w')
for i in range(len(inputdata)):
    updatedata[i]["income"]=inputdata[i]["income"]
fre.write(json.dumps(updatedata))
fre.close()
