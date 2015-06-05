/* create a new namespace for the application */
var $vig = $vig || {};

/* psudo-constants available to the entire namespace. */
$vig.CHARACTERS = [
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
    'a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z',
    '0','1','2','3','4','5','6','7','8','9',',','_',' ',
    ':',';','@','#','-','/','|','=','\)','\!','\$','\%',
    '\^','\&','\*','\(','\.','\'','"','?','\+','\<','\>',
    '\{','\}','\[','\]','\\','\n','\t'
];

$vig.init = function(){
    $('button').off().on('click',function(){
        var i, n, d, jThis, action, aSrc, aKey, processedText, vigenere, jDes, jSrc;
        jThis = $(this);
        action = jThis.attr('data-action');
        vigenere = $vig.createvigenereArray($vig.CHARACTERS);
        
        if(action === 'showgrid'){
            $vig.showVigenereGrid(vigenere);
        }
        else{
            aKey = $('#cipherKey').val();
            aKey = aKey.split('');
            if(aKey.length === 0){
                alert('You must include a cipher key.');
                return;
            }
            processedText = '';

            if(action === 'encrypt'){
                jSrc = $('#clearText');
                jDes = $('#encryptedText');
            }
            else{
                jSrc = $('#encryptedText');
                jDes = $('#clearText');
            }
            aSrc = jSrc.val();
            jDes.val('');
            aSrc = aSrc.split('');
            //convert the cipher key into numerical equivlants
            for (i = 0; i < aKey.length; i++){
                aKey[i] = $.inArray(aKey[i],$vig.CHARACTERS)
            }
            //convert the clear/encrypted text into numerical equivalants
            if(action === 'encrypt'){
                for (i = 0; i < aSrc.length; i++){
                    aSrc[i] = $.inArray(aSrc[i],$vig.CHARACTERS)
                }
            }
            //loop over the clear/encrypted text matching each character with it's appropriate key index
            n = 0; 
            // n is the index of the cipher key array. if we reach the end of the cipher key before
            //we reach the end of the clear/encrypted text then we will start n back at 0.
            for(i = 0; i < aSrc.length; i++){
                if(action === 'encrypt'){
                    encryptedCharacter = vigenere[aSrc[i]][aKey[n]];
                        processedText += encryptedCharacter;
                }
                else{
                    //loop from 0 to $vig.CHARACTERS.length looking for the index that corresponds to the encrypted character we're looking for
                    for(d = 0; d < $vig.CHARACTERS.length; d++){
                        if(vigenere[aKey[n]][d] === aSrc[i]){
                            processedText += vigenere[0][d];
                            break;
                        }
                    }
                }
                n++;
                if(n === aKey.length){
                    n = 0;
                }
            }
            jSrc.val('');
            jDes.val(processedText);
        }

    });
    
};

$vig.createvigenereArray = function(chars){
    var i, tmp, vig = [], chars = chars.slice();

    for (i = 0; i < chars.length; i++){
        if(i > 0){
            tmp = chars.shift();
            chars.push(tmp);
        }
        vig[i] = chars.slice();
    }
    
    return vig;
};

$vig.showVigenereGrid = function(vigenere){
    var i, n, aRow, jGrid = $('#vigeneregrid');
    jGrid.empty();
    for(i = 0; i < vigenere.length; i++){
        aRow = [];
        aRow.push('<tr>');
        for(n = 0; n < vigenere[i].length; n++){
            aRow.push('<td style="width:18px; height:18px; text-align:center;">');
            if(vigenere[i][n] === ' '){
                aRow.push('&nbsp;');
            }
            else if(vigenere[i][n] === '\n'){
                aRow.push('CR');
            }
            else{
                aRow.push(vigenere[i][n]);
            }
            aRow.push('</td>');
        }
        aRow.push('</tr>');
        jGrid.append(aRow.join(''));
    }
};

$('document').ready(function(){
    $vig.init();
});