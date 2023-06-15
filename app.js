const splitFile = require('split-file');
const fs = require('fs');

function readAndSorted(path1, path2, isSorted) {

    try {
        let mergeText = fs.readFileSync(path1, {encoding: 'utf-8'}) + 
                        fs.readFileSync(path2, {encoding: 'utf-8'}); 
    
        mergeText = mergeText.replace(/\s/g, '').split('');

        mergeText = mergeText.sort((a, b) => {
            
            if(a < b) { return -1; }
            if(a > b) {
                isSorted = false;
                return 1;
            }
            return 0;
        });
        
        return [
            mergeText.splice(0, mergeText.length / 2).join(''),
            mergeText.join(''),
            isSorted
            ];
    }
    catch (error) { console.log(error) }
}

function writeInFiles(path1, path2, string1, string2) {

    fs.writeFileSync(path1, string1, (err) => console.log(err));
    fs.writeFileSync(path2, string2, (err) => console.log(err));
}

//Разбиваем in.txt файл на равные части (не больше 250 Мб)
splitFile.splitFileBySize(__dirname + '/in.txt', 250000000, __dirname + '/temp')
    .then((names) => {

        let isSorted = true;

        //Пока ни одна позиция не поменялась местами
        while(isSorted) {
            
            //Проходимся по каждому временному файлу
            for(let i = 0; i < names.length - 1; i++) {
            
                const [string1, string2, done] = readAndSorted(names[i], names[i + 1], isSorted);
                isSorted = done;
                writeInFiles(names[i], names[i + 1], string1, string2)
            }
        }
        
        //Как только все временные файлы отсортированы,
        //соединяем каждый файл в out.txt 
        for(let path of names) {
            
            try {
                
                const readPart = fs.readFileSync(path, {encoding: 'utf-8'});
                fs.appendFileSync(__dirname + '/out.txt', readPart);
            } 
            catch (error) { console.log(error) }
            finally { fs.unlinkSync(path) }
        }
    });

