<script>
    $(document).ready(function () {
        generateFreezeColumns('#Table',3);
    });

    //凍結窗格
    function generateFreezeColumns(originalTable, frzCols){
        var $originalTable = $(originalTable);
        var $target = $originalTable.parent();

        $table = $originalTable.clone();
        $table.each(function() {
                $(this).children().remove();
        });
        $table.removeAttr('id').attr('id','freezeTable');

        var $thead = $originalTable.find('thead').clone();
        $.each($thead.find('tr').eq(0).find('th'), function(index, element){
            if(index >= frzCols){
                $(this).remove();
            }
        });

        var $tbody = $('<tbody></tbody>');
        $originalTable.find('tbody').find('tr').each(function() {
            var $tds = $(this).children();
            var $row = $('<tr></tr>');
            for(var i = 0 ; i < frzCols ; i++ ){
                $row.append($tds.eq(i).clone());
            }
            $row.appendTo($tbody);
        });

        $thead.appendTo($table);
        $tbody.appendTo($table);
        $table.appendTo($target);

        freezeEvent(originalTable);
        freezeScrollEvent(originalTable);
    }

    function freezeEvent(originalTable) {
        var $offset = $('.navbar').height();
        var $originalTable = $(originalTable);

        //Header: stickyTableHeaders套件設定
        $originalTable.stickyTableHeaders({ fixedOffset: $offset });
    }

    //凍結窗格事件
    var activeFlag = false;
    function freezeScrollEvent(originalTable) {
        var $offset = $('.navbar').height();
        var $originalTable = $(originalTable);
        var $freezeTable = $('#freezeTable');
        var limitLeft = $originalTable.offset().left;
        var limitTop = $originalTable.offset().top - $offset;

        //Column:
        //左右滾軸移動超過框架極限時
        if ($(window).scrollLeft() > limitLeft) {
            $freezeTable.attr('style', 'left:0px;position:fixed;width:auto;background:white;margin-left:0;margin-top:0;');
            $freezeTable.css('top', $originalTable.offset().top);

            //若超過limitLeft極限僅需BIND一次
            if (!activeFlag) {
                $freezeTable.show();

                $originalTable.find('tbody').delegate('tr','hover', function(){
                　　console.log($(this).index());
                });

                //選取列與凍結列同步變色
                $originalTable.find('tbody').find('tr').hover(
                    function(){
                        $freezeTable.find('tbody').find('tr').eq( $(this).index() ).css('background-color','#FEF4EC');
                    },
                    function(){
                        if($(this).index() % 2 == 0){
                            $freezeTable.find('tbody').find('tr').eq( $(this).index() ).css('background-color','#F9F9F9');
                        }
                        else{
                            $freezeTable.find('tbody').find('tr').eq( $(this).index() ).css('background-color','white');
                        }
                    }
                );
                //凍結列與選取列同步變色
                $freezeTable.find('tbody').find('tr').hover(
                    function(){
                        $originalTable.find('tbody').find('tr').eq( $(this).index() ).css('background-color','#FEF4EC');
                    },
                    function(){
                        if($(this).index() % 2 == 0){
                            $originalTable.find('tbody').find('tr').eq( $(this).index() ).css('background-color','#F9F9F9');
                        }
                        else{
                            $originalTable.find('tbody').find('tr').eq( $(this).index() ).css('background-color','white');
                        }
                    }
                );

                activeFlag = true;
            }
        }
        else {
            $('#freezeTable').hide();
            $originalTable.find('tbody').find('tr').unbind();
            $freezeTable.find('tbody').find('tr').unbind();
            activeFlag = false;
        }

        if($(window).scrollTop() > 0){
            //上下滾軸移動時，freezeTable跟著移動
            $freezeTable.css('top', $originalTable.offset().top - $(window).scrollTop());
        }

        if ($(window).scrollTop() > limitTop) {
            //freezeTable置於table上層
            $freezeTable.stickyTableHeaders({ fixedOffset: $offset });
            $freezeTable.css('z-index', 100);
        }            
    }

    $(window).scroll(function () {
        var $originalTable = $('Table');
        freezeScrollEvent($originalTable);
        
        $('#animatePosition').each(function(){
            $(this).css('left', $(window).scrollLeft());
        });
    })

    $(window).resize(function () {
        var $originalTable = $('Table');
        freezeScrollEvent($originalTable);
    });
</script>