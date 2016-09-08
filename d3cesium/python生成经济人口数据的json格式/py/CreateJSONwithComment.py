# -*- coding: utf-8 -*-
import xlrd
import json
# 设置GBK编码,excel默认是gbk2312,这里声明一下编码方式，或是在office中改变excel文件的编码方式
xlrd.Book.encoding = "gbk2312"
data = xlrd.open_workbook('1800-2015LifeExpe.xls')
#获取第一个sheet表
table=data.sheets()[0]
#行数和列数"
nrows=table.nrows
ncols = table.ncols
print "the length of rows is %d,columns is %d" %(nrows,ncols)
# returnJson是个列表对象
returnJson=[]
#第一层：对所有行遍历
for i in range(1,nrows):
    #returnData是个字典对象
    returnData={}
    #每行的长度,217行
    rowlength=len(table.row_values(i))
    #首列的国名，table.row_values(i)是个列表，存储每一行的数据
    returnData["name"]=table.row_values(i)[0]
    #tmpdata是个二维列表，存储[[valuecell],[valuecell]...]
    tmpdata=[[]]
    #valuecell是个一维列表，存储[year,value]
    valuecell=[]
    #year是年份列表，表格中年份是1800~2015，此处year=[1799,1800,1801,....2015],首元素是1799，是为了满足下面的for循环
    year=range(1799,2016)
    #第二层：对每一行中所有列遍历
    for j in range(1,rowlength):#从j=1开始
        #判断，如果这一年对应的单元格值不为空，则将值添加到列表valuecell中，valuecell是个有两个元素的的一维列表[year,value]
        if table.row_values(i)[j]!='':
            valuecell.append(int(year[j]))
            valuecell.append(float(table.row_values(i)[j]))
        #如果对应单元格的值为空，则跳过这一年
        else:
            j=j+1

        #如果valuecell不是空列表，则将valuecell作为一个元素添加到二维列表tmpdata里
        if len(valuecell):#元素不为空
            tmpdata.insert(-1,valuecell)
        valuecell=[]
     #删除tmpdata列表中空元素
    for element in tmpdata:
        if len(element)==0:
            tmpdata.remove(element)
    #将tmpdata作为字典对象returnData["attribute"]的属性值添加
    returnData["lifeExpectancy"]=tmpdata
    #把字典对象returnData添加到 由字典组成的列表returnJson中
    returnJson.append(returnData)
#写入JSON文件
JSfile = open('LifeExpec01.json', 'w')
#json.dumps(returnJson)是将python的字典对象returnJson转换成json数据
JSfile.write(json.dumps(returnJson))
JSfile.close()

