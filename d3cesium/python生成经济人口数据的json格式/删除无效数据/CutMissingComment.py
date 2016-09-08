# -*- coding: utf-8 -*-
__author__ = 'zhangyu'
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import json
f1 = file("final_region.json")
f1data = json.load(f1)
f1.close()
#有region的国家177个
hasnumber=0
regionnation=[]
f2data=[]
f3data=[]
#将没有region属性的删除
for ele1 in f1data:
    if  ele1.has_key("region"):
        hasnumber=hasnumber+1
        regionnation.append(ele1["name"])
        f2data.append(ele1)
#三个属性只要有一个为空数组的就删除
for ele2 in f2data:
    if len(ele2["income"])>0 and len(ele2["lifeExpectancy"])>0 and len(ele2["population"])>0 :
        #最终把数据放到f3data里
        f3data.append(ele2)
#验证长度
print len(f1data)
print len(f2data)
print len(f3data)
fout = open('output.json', 'w')
json.dump(f3data, fout)
fout.close()
