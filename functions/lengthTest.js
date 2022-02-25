function lengthTest(msg_array)
{
    let arr = msg_array;
    if(arr.legth == 1)
    {
        return 0;
    }
    else
    {
        return 1;
    }
}
module.exports.lengthTest = lengthTest;