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
        var i, n, d, srcStart, srcLimit, jThis, jMessageArea, action, aSrc, aKey, processedText, vigenere, jDes, jSrc, originalChar, DestinationIsClearText;
        jThis = $(this);
        action = jThis.attr('data-action');
        jMessageArea = $('#messageArea');
        jMessageArea.empty(); //clearing the message area of any previous messages.
        vigenere = $vig.createVigenereArray($vig.CHARACTERS);
        
        if(action === 'showgrid'){
            $vig.showVigenereGrid(vigenere);
        }
        else{
            if(action === 'encrypt'){
                DestinationIsClearText = false;
                jSrc = $('#clearText');
                jDes = $('#encryptedText');
            }
            else{
                DestinationIsClearText = true;
                jSrc = $('#encryptedText');
                jDes = $('#clearText');
            }
            aKey = $('#cipherKey').val();
            aKey = aKey.split('');
            if(aKey.length === 0){
                jMessageArea.empty().append('ERROR[1]: You must provided a cipher key.');
                return;
            }
            processedText = '';

            aSrc = jSrc.val();
            jDes.val('');
            aSrc = aSrc.split('');
            //convert the cipher key into numerical equivlants
            for (i = 0; i < aKey.length; i++){
                aKey[i] = $.inArray(aKey[i],$vig.CHARACTERS);
            }
            //convert the clear/encrypted text into numerical equivalants
            if(action === 'encrypt'){
                for (i = 0; i < aSrc.length; i++){
                    originalChar = aSrc[i];
                    aSrc[i] = $.inArray(aSrc[i],$vig.CHARACTERS);
                    if(aSrc[i] == -1){
                        jMessageArea.empty().append('ERROR[2]: Encountered unknown character "' + originalChar + '". Click "Show Grid" to see what characters are acceptable.');
                        return;
                    }
                }
            }
            //loop over the clear/encrypted text matching each character with it's appropriate key index
            n = 0; 
            // n is the index of the cipher key array. if we reach the end of the cipher key before
            //we reach the end of the clear/encrypted text then we will start n back at 0.
            if(action === 'encrypt'){
                srcStart = 0;
                srcLimit = aSrc.length;
                if(aSrc.length === 0){
                    jMessageArea.empty().append("ERROR[3]: Nothing to encrypt.");
                    return;
                }
            }
            else{
                //we need to skip the first 43 characters of the encrypted text assuming that this is the beginning token.
                //likewise, we skip the last 41 characters of the encrypted text assuming that this is the ending token.
                srcStart = 43;
                srcLimit = parseInt((aSrc.length - 41),10);
                if(aSrc.length === 0){
                    jMessageArea.empty().append("ERROR[4]: Nothing to decrypt.");
                    return;
                }
            }
            for(i = srcStart; i < srcLimit; i++){
                if(action === 'encrypt'){
                    encryptedCharacter = vigenere[aSrc[i]][aKey[n]];
                        processedText += encryptedCharacter;
                }
                else{
                    //loop over $vig.CHARACTERS looking for the index that corresponds to the encrypted character we're looking for
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
            if(DestinationIsClearText){
                jDes.val(processedText);
            }
            else{
                jDes.val('---------- BEGIN ENCRYPTED TEXT ----------\n' + processedText + '\n---------- END ENCRYPTED TEXT ----------');
            }
        }

    });
    
};

$vig.createVigenereArray = function(chars){
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
